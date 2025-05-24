import { getFundraisers } from "~/data/fundraisers";
import { BrowseFundraisers } from "~/components/browse-fundraisers";

export default async function FundraisersPage() {
    const fundraisers = await getFundraisers();

    return <BrowseFundraisers fundraisers={fundraisers} />
}