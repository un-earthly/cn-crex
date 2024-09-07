"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"


export default function Component() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated")
        if (authStatus !== "true") {
            router.push("/auth/login")
        } else {
            setIsAuthenticated(true)
        }
    }, [router])
    const [ads, setAds] = useState([
        { id: 1, title: "Summer Sale", description: "Get 50% off on all summer items", imageUrl: "/placeholder.svg?height=100&width=200", link: "https://example.com/summer-sale" },
        { id: 2, title: "New Collection", description: "Check out our latest fashion collection", imageUrl: "/placeholder.svg?height=100&width=200", link: "https://example.com/new-collection" },
    ])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentAd, setCurrentAd] = useState(null)

    const handleOpenModal = (ad = null) => {
        setCurrentAd(ad || { id: 0, title: "", description: "", imageUrl: "", link: "" })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentAd(null)
    }

    const handleSaveAd = () => {
        if (currentAd) {
            if (currentAd.id === 0) {
                // Add new advertisement
                setAds([...ads, { ...currentAd, id: Math.max(0, ...ads.map(ad => ad.id)) + 1 }])
            } else {
                // Update existing advertisement
                setAds(ads.map(ad => ad.id === currentAd.id ? currentAd : ad))
            }
            handleCloseModal()
        }
    }

    const handleDeleteAd = (id) => {
        setAds(ads.filter(ad => ad.id !== id))
    }
    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated")
        router.push("/auth/login")
    }

    if (!isAuthenticated) {
        return null // Or a loading spinner
    }
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Advertisement Dashboard</h1>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Advertisement
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ads.map((ad) => (
                        <TableRow key={ad.id}>
                            <TableCell>{ad.title}</TableCell>
                            <TableCell>{ad.description}</TableCell>
                            <TableCell>
                                <img src={ad.imageUrl} alt={ad.title} className="w-20 h-10 object-cover rounded" />
                            </TableCell>
                            <TableCell>
                                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {ad.link}
                                </a>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(ad)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentAd?.id === 0 ? 'Add New Advertisement' : 'Edit Advertisement'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={currentAd?.title}
                                onChange={(e) => setCurrentAd(currentAd ? { ...currentAd, title: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={currentAd?.description}
                                onChange={(e) => setCurrentAd(currentAd ? { ...currentAd, description: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageUrl" className="text-right">
                                Image URL
                            </Label>
                            <Input
                                id="imageUrl"
                                value={currentAd?.imageUrl}
                                onChange={(e) => setCurrentAd(currentAd ? { ...currentAd, imageUrl: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">
                                Link
                            </Label>
                            <Input
                                id="link"
                                value={currentAd?.link}
                                onChange={(e) => setCurrentAd(currentAd ? { ...currentAd, link: e.target.value } : null)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSaveAd}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}