import { Link } from 'react-router-dom';

export default function NotFound(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-purple-800">404</h1>
                <div className="mt-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-8">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
                    <Link 
                        to="/" 
                        className="inline-block bg-purple-800 text-white py-3 px-6 rounded-lg font-medium transition-all hover:bg-purple-900"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
} 