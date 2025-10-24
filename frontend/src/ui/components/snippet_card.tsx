import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../assets/card";
import SnippetAccordion from "./snippet_accordion";
import { FaEye } from "react-icons/fa";
import { FaLink } from "react-icons/fa";

export default function SnippetCard({
  setClosed,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Card className="p-2">
      <CardHeader className="p-0 text-muted-foreground text-sm">username</CardHeader>
      <CardContent>
        <Card className="min-w-[500px] border-none shadow-none">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <div>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <FaEye className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                <FaLink className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SnippetAccordion setClosed={setClosed} />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
