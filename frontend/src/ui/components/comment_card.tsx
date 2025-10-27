import { Card, CardContent, CardHeader } from "../assets/card";
import { FaHeart } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import { Label } from "../assets/label";
import { Button } from "../assets/button";
import { faker } from "@faker-js/faker";
import { useState } from "react";
import LoginDialog from "./login_dialog";
export default function CommentCard({ closed }: { closed: boolean }) {
  const [open, setOpenLogin] = useState(false);

  return (
    <>
      <Card
        className={`overflow-hidden animate flex flex-col  ${
          closed ? "w-[50px] h-[50px]  p-0 " : "w-120 h-150 "
        }`}
        style={{ borderRadius: closed ? "30px" : "1rem" }}
      >
        <CardHeader className="p-3 ">
          <FaHeart
            size={24}
            className="cursor-pointer animate text-[var(--primary)] hover:text-[var(--secondary)]"
          />
        </CardHeader>

        <CardContent className="flex flex-col flex-1 overflow-hidden">
          <div className="my-4 border" />
          <div className="grid w-full gap-3">
            <Label htmlFor="message" className="font-mono">
              Username
            </Label>
            <TextareaAutosize
              placeholder="Écrivez votre message ici !"
              id="message"
              className="font-mono text-sm border p-2 placeholder-gray-400 rounded-sm focus:outline-none"
              minRows={3}
            />
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpenLogin(true)}>Envoyer</Button>
            </div>
          </div>
          <div className="my-4 border" />
          <div className="flex-1 overflow-y-auto">
            <Label>Commentaires</Label>
            <div className="my-4" />
            <div className="flex flex-col gap-3">
              {[
                faker.lorem.paragraphs(5),
                faker.lorem.paragraphs(1),
                faker.lorem.paragraphs(3),
              ].map((text, i) => (
                <div key={i} className="p-3 border rounded-sm font-mono m-2">
                  <h3 className=" text-secondary">_Username</h3>
                  <div className="my-1" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <LoginDialog open={open} setOpen={setOpenLogin} />
    </>
  );
}
