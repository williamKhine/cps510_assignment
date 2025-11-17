import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const users = [
  { id: 1, name: "Paolo Chan", avatarUrl: "https://avatars.githubusercontent.com/u/118681804?v=4", link: "https://github.com/paolochan" },
  { id: 2, name: "Krystal Zin", avatarUrl: "https://avatars.githubusercontent.com/u/128641611?v=4", link: "https://github.com/krystalZin" },
  { id: 3, name: "William Khine", avatarUrl: "https://avatars.githubusercontent.com/u/61590966?v=4", link: "https://github.com/williamKhine" },
];

export default function Group11Page() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="flex-col  gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-64 h-64 rounded-full object-cover"
              />
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>Member</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a href={user.link} className="text-sm text-muted-foreground">{user.link}</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}