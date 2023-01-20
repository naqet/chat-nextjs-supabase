import { type FormEvent, useState } from "react";
import { useRouter } from "next/router";
import useTypedSbClient from "@/utils/useTypedSbClient";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabaseClient = useTypedSbClient();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError("");
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
        setError(e.message);
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
      <Link href="signup">Sign up</Link>
      {error && (
        <p>
          <small>{error}</small>
        </p>
      )}
    </form>
  );
}
