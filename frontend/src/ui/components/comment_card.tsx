import { Card, CardContent, CardFooter, CardHeader } from "../assets/card";
import { FaHeart } from "react-icons/fa";

export default function CommentCard({ closed }: { closed: boolean }) {
  return (
    <Card
      className={`overflow-hidden animate  ${closed ? "w-[50px] h-[50px]  p-0 " : "w-120 h-150 "}`}
      style={{ borderRadius: closed ? "30px" : "1rem" }}
    >
      <CardHeader className="p-3 [color:var(--primary)]">
        <FaHeart size={24} />
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
