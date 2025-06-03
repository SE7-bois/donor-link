import { EditFundraiserForm } from "~/components/edit-fundraiser-form";

export default function EditFundraiserPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold">Edit Fundraiser</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <EditFundraiserForm />
      </main>
    </div>
  );
} 