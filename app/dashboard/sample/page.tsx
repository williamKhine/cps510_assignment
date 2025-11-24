import ReadTable from "@/components/tickets-table";
import CreateTicketForm from "@/components/ticket-form";

export default function Page() {
  return (
    <main className="p-6 space-y-8">
      <h1 className="text-xl font-bold">Tickets</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">Create New Ticket</h2>
        <CreateTicketForm />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">All Tickets</h2>
        <ReadTable />
      </section>
    </main>
  );
}
