import { AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function DataNotFound() {
    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center">
            <div className="p-8 rounded-lg max-w-md mx-auto text-center">
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
                <h1 className="text-3xl font-bold mb-2">Oops! No Data Found</h1>
                <p className="mb-6 text-gray-400">
                    We couldn&apos;t find the match data you&apos;re looking for.
                    The cricketers might be taking an unexpected tea break!
                </p>
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                >
                    Refresh Page
                </Button>
            </div>
        </div>
    )
}