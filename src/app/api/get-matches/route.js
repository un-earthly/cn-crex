import axios from "axios"

// export default async function GET(req, res) {
//    
// }


// export const dynamic = 'force-static'
export async function GET() {
    try {
        const response = await axios.get("https://e765432.xyz/static/69fb31e65e4ed5d6eaebf3b8b0e0e6a715c77cc6/geteventlist.php");

        const data = response.data.data.getMatches;

        return new Response(JSON.stringify({ message: 'fetched!', data }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error fetching data', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}