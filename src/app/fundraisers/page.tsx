"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { BrowseFundraisersConvex } from "~/components/browse-fundraisers-convex";

export default function FundraisersPage() {
    return <BrowseFundraisersConvex />
}