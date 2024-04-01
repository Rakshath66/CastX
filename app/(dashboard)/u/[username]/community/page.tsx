import { Payment } from "./_components/columns";

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      // ...
    ]
}

export const CommunityPage = () => {
  return (
     <div>
        page
     </div>
  );
};