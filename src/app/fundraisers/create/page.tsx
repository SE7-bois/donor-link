import { CreateFundraiserForm } from "~/components/create-fundraiser-form"
export default function CreateFundraiserPage() {
  return (
    <div className="container max-w-3xl py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create a New Fundraiser</h1>
        <p className="text-muted-foreground">Share your vision and start raising funds for your project on Solana.</p>
      </div>
      <CreateFundraiserForm />
    </div>
  )
}
