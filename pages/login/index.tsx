import { type FormEvent, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setMessage("");
      setLoading(true);
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      const { email, password } = formData;

      if (typeof email !== "string" || typeof password !== "string")
        throw Error("Form is not valid");

      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw Error(error.message);

      setLoading(false);

      router.push("/");
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        setMessage(e.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <button type="submit" aria-busy={loading}>
        Login
      </button>
      {message && <small>{message}</small>}
    </form>
  );
}
