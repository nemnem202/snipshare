import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../assets/card";
import SnippetAccordion from "./snippet_accordion";
import { FaEye } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";

export default function SnippetCard({
  setClosed,
  userOrigin = true,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
  userOrigin?: boolean;
}) {
  return (
    <Card className="p-2">
      <CardHeader className="p-0 text-muted-foreground text-sm">username</CardHeader>
      <CardContent>
        <Card className="min-w-[500px] border-none shadow-none">
          <CardHeader>
            <div className="flex justify-between items-top w-full">
              <div>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </div>
              {userOrigin && (
                <div className="flex gap-2">
                  <FaEye className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  <FaLink className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  <FaEdit className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  <FaSave className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                </div>
              )}
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
