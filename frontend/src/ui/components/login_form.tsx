import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../assets/form";
import { Input } from "../assets/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod";
import { Button } from "../assets/button";
import { Card, CardContent } from "../assets/card";
import { NavLink } from "react-router-dom";
import Fetcher from "../../lib/fetcher";
import { toast } from "sonner";
import type { ServerResponse } from "../../types/general/response";
import { useContext } from "react";
import { SessionContext } from "../../provider/session_provider";
import { Custom } from "../../lib/logger";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 5 caractères",
  }),
  email: z.email({
    message: "format d'email incorrect",
  }),
});

export default function LoginForm({
  behaviorOnSuccess,
  changeMode,
}: {
  behaviorOnSuccess: () => any;
  changeMode: () => any;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const ctx = useContext(SessionContext);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await Fetcher.post<ServerResponse>(values, "/auth/login");

    if (!ctx) return Custom.error("SessionProvider error");

    const { session, setSession } = ctx;

    if (res.success) {
      setSession(true);
      behaviorOnSuccess();
    }
  };
  return (
    <Card className="p-5 bg-background">
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder="john-doe@gmail.com"
                      {...field}
                      className="animate w-[200px]"
                    />
                  </FormControl>
                  <FormMessage className="w-[200px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="animate w-[200px]"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage className="w-[200px]" />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center gap-1 w-full">
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
              <button
                onClick={changeMode}
                className="no-underline hover:underline hover:text-primary animate text-sm"
              >
                Créer un compte
              </button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
