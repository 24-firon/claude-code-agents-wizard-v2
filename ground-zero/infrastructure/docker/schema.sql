-- Ground-Zero PostgreSQL Schema
-- Source of Truth for task queue and state management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Task Queue Table
CREATE TABLE IF NOT EXISTS task_queue (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'retrying')),
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    next_retry_at TIMESTAMP,

    -- Worker tracking
    worker_id INTEGER,

    -- Result & Error
    result JSONB,
    error_message TEXT,

    -- Retry tracking
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,

    -- Indexes
    CONSTRAINT valid_dates CHECK (
        (completed_at IS NULL OR started_at IS NOT NULL) AND
        (started_at IS NULL OR created_at IS NOT NULL)
    )
);

-- Indexes for task_queue
CREATE INDEX idx_task_queue_status ON task_queue(status);
CREATE INDEX idx_task_queue_priority_created ON task_queue(priority ASC, created_at ASC) WHERE status = 'pending';
CREATE INDEX idx_task_queue_task_type ON task_queue(task_type);
CREATE INDEX idx_task_queue_worker_id ON task_queue(worker_id) WHERE worker_id IS NOT NULL;
CREATE INDEX idx_task_queue_next_retry ON task_queue(next_retry_at) WHERE status = 'retrying';

-- Unified State Table
CREATE TABLE IF NOT EXISTS unified_state (
    state_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    state_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    source VARCHAR(20) DEFAULT 'postgres',
    version INTEGER DEFAULT 1,

    -- Composite unique constraint (task + state_type)
    UNIQUE(task_id, state_type, version)
);

-- Indexes for unified_state
CREATE INDEX idx_unified_state_task_id ON unified_state(task_id);
CREATE INDEX idx_unified_state_task_state ON unified_state(task_id, state_type);
CREATE INDEX idx_unified_state_created ON unified_state(created_at DESC);
CREATE INDEX idx_unified_state_version ON unified_state(task_id, state_type, version DESC);

-- Event Bus Table (for Pub/Sub)
CREATE TABLE IF NOT EXISTS event_bus (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    task_id UUID,
    payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    consumed BOOLEAN DEFAULT FALSE,
    consumed_at TIMESTAMP
);

-- Indexes for event_bus
CREATE INDEX idx_event_bus_type ON event_bus(event_type);
CREATE INDEX idx_event_bus_consumed ON event_bus(consumed) WHERE consumed = FALSE;
CREATE INDEX idx_event_bus_task_id ON event_bus(task_id) WHERE task_id IS NOT NULL;

-- Metrics Table (for monitoring)
CREATE TABLE IF NOT EXISTS metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    labels JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for metrics
CREATE INDEX idx_metrics_name_timestamp ON metrics(metric_name, timestamp DESC);
CREATE INDEX idx_metrics_timestamp ON metrics(timestamp DESC);

-- Functions

-- Function: Auto-retry failed tasks
CREATE OR REPLACE FUNCTION retry_failed_tasks()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE task_queue
    SET status = 'pending', next_retry_at = NULL
    WHERE status = 'retrying'
      AND next_retry_at IS NOT NULL
      AND next_retry_at <= NOW();

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Get queue statistics
CREATE OR REPLACE FUNCTION get_queue_stats()
RETURNS TABLE (
    status VARCHAR(20),
    count BIGINT,
    avg_processing_time INTERVAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tq.status,
        COUNT(*) as count,
        AVG(tq.completed_at - tq.started_at) as avg_processing_time
    FROM task_queue tq
    GROUP BY tq.status;
END;
$$ LANGUAGE plpgsql;

-- Function: Cleanup old completed tasks
CREATE OR REPLACE FUNCTION cleanup_old_tasks(days_to_keep INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM task_queue
    WHERE status IN ('completed', 'failed')
      AND completed_at < NOW() - (days_to_keep || ' days')::INTERVAL;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Triggers

-- Trigger: Auto-update timestamps
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Views

-- View: Active tasks (for monitoring)
CREATE OR REPLACE VIEW v_active_tasks AS
SELECT
    task_id,
    task_type,
    status,
    priority,
    created_at,
    started_at,
    NOW() - started_at as processing_duration,
    worker_id,
    retry_count
FROM task_queue
WHERE status IN ('pending', 'in_progress', 'retrying')
ORDER BY priority ASC, created_at ASC;

-- View: Task statistics (for dashboard)
CREATE OR REPLACE VIEW v_task_stats AS
SELECT
    task_type,
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration_seconds,
    MAX(completed_at) as last_completed
FROM task_queue
WHERE completed_at IS NOT NULL
GROUP BY task_type, status;

-- Initial data / Example tasks (optional)

-- Insert example pending task
INSERT INTO task_queue (task_type, payload, status, priority)
VALUES
    ('llm_reasoning', '{"prompt": "Hello, world!", "model": "llama2"}', 'pending', 5),
    ('simple_computation', '{"operation": "add", "args": [1, 2, 3]}', 'pending', 3)
ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE task_queue IS 'FIFO queue for task processing with priority support';
COMMENT ON TABLE unified_state IS 'Versioned state storage with PostgreSQL as source of truth';
COMMENT ON TABLE event_bus IS 'Event pub/sub for inter-service communication';
COMMENT ON TABLE metrics IS 'Time-series metrics for monitoring';

COMMENT ON FUNCTION retry_failed_tasks() IS 'Moves retrying tasks back to pending when retry time reached';
COMMENT ON FUNCTION get_queue_stats() IS 'Returns queue statistics grouped by status';
COMMENT ON FUNCTION cleanup_old_tasks(INTEGER) IS 'Deletes completed/failed tasks older than N days';
