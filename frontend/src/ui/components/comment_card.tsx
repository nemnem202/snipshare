import { Card, CardContent, CardHeader } from "../assets/card";
import { FaHeart } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import { Label } from "../assets/label";
import { Button } from "../assets/button";
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import LoginDialog from "./login_dialog";
import useGetSession from "../../hooks/get_session";
import { useSnippet } from "./snippet_container";
import type { ExplorerComment } from "../../types/general/explorerComment";
import Fetcher from "../../lib/fetcher";
import type { ServerResponse } from "../../types/general/response";
import { Custom } from "../../lib/logger";

export default function CommentCard({
  closed,
  comments,
  setComments,
}: {
  closed: boolean;
  comments: ExplorerComment[];
  setComments: Dispatch<SetStateAction<ExplorerComment[]>>;
}) {
  const [open, setOpenLogin] = useState(false);
  const { snippet } = useSnippet();
  const [liked, setLiked] = useState(false);

  const session = useGetSession();

  const send = async () => {
    if (!session) {
      setOpenLogin(true);
    }
  };

  useEffect(() => {
    if (!snippet) return;
    setLiked(snippet.likes);
  }, [snippet]);

  if (!snippet) return null;

  const handleLike = async () => {
    await send();
    if (liked) {
      Custom.log("code snippet", snippet.code_snippet);
      const liked = await Fetcher.get<ServerResponse>("/social/unlike/" + snippet.code_snippet);

      if (liked.success === true) {
        setLiked(false);
      }
    } else {
      Custom.log("code snippet", snippet.code_snippet);
      const liked = await Fetcher.get<ServerResponse>("/social/like/" + snippet.code_snippet);

      if (liked.success === true) {
        setLiked(true);
      }
    }
  };
  return (
    <>
      <Card
        className={`overflow-hidden animate flex flex-col  ${
          closed ? "w-[50px] h-[50px]  p-0 " : "w-120 h-150 "
        }`}
        style={{ borderRadius: closed ? "30px" : "1rem" }}
      >
        <div className="flex items-center w-min">
          <CardHeader className="p-3 ">
            <FaHeart
              size={24}
              onClick={() => handleLike()}
              className={`${
                liked ? "text-[var(--primary)]" : "text-[var(--secondary)] opacity-50"
              } cursor-pointer animate hover:text-[var(--primary)] `}
            />
          </CardHeader>
          <div className="opacity-50">{snippet._count.likes}</div>
        </div>

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
              <Button onClick={() => send()}>Envoyer</Button>
            </div>
          </div>
          <div className="my-4 border" />
          <div className="flex-1 overflow-y-auto">
            <Label>Commentaires</Label>
            <div className="my-4" />
            <div className="flex flex-col gap-3">
              {comments
                .sort(
                  (a, b) => new Date(a.commentDate).getTime() - new Date(b.commentDate).getTime()
                )
                .map((comment, i) => (
                  <div key={i} className="p-3 border rounded-sm font-mono m-2">
                    <h3 className=" text-secondary">_{comment.user.username} </h3>
                    <div className="my-1" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {comment.content}
                    </p>
                    <span className="opacity-50 text-xs">
                      {new Date(comment.commentDate).toLocaleDateString("fr-FR")}
                    </span>
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
