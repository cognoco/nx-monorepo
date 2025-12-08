/**
 * 404 Not Found Page
 *
 * This component is rendered when a page is not found (404 error).
 * Required by Next.js App Router for proper error handling.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <h2 className="mt-2 text-xl text-gray-600">Page Not Found</h2>
      <p className="mt-4 text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
