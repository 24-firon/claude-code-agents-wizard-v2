import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-9xl font-bold text-ki-gold mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-ki-gray mb-8 max-w-2xl mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center">
          <Button href="/">Go Home</Button>
          <Button href="/contact" variant="secondary">Contact Us</Button>
        </div>
      </div>
    </div>
  )
}
