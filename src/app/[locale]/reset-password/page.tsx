"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Label, FieldError } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { apiFetch, ApiError } from "@/lib/api";
import { errorMessageKey } from "@/lib/error-messages";
import { STRONG_PASSWORD_REGEX } from "@/lib/password";

const resetPasswordSchema = z
  .object({
    new_password: z.string().refine((value) => STRONG_PASSWORD_REGEX.test(value), {
      message: "Password must include upper/lowercase, a number, and a symbol.",
    }),
    confirm_password: z.string().min(1),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const tAuth = useTranslations("auth");
  const tErr = useTranslations("errors");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, new_password: values.new_password }) });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? tErr(errorMessageKey(err.code)) : tErr("generic"));
    }
  });

  return (
    <div className="mx-auto max-w-[440px] py-16">
      <h1 className="text-headline-lg-mobile">{t("pageTitle")}</h1>
      <Card className="mt-8 p-8">
        {done ? (
          <div>
            <p className="text-body-lg">{t("success")}</p>
            <Link href="/" className="mt-4 inline-block text-body-md underline">
              {t("backToHome")}
            </Link>
          </div>
        ) : !token ? (
          <p className="text-body-md text-error">{t("invalidLink")}</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new_password">{tAuth("passwordLabel")}</Label>
              <PasswordInput id="new_password" autoComplete="new-password" {...register("new_password")} />
              <FieldError>{errors.new_password?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="confirm_password">{tAuth("confirmPasswordLabel")}</Label>
              <PasswordInput id="confirm_password" autoComplete="new-password" {...register("confirm_password")} />
              <FieldError>{errors.confirm_password?.message}</FieldError>
            </div>
            <p className="text-body-sm text-ink-muted">{tAuth("passwordRequirements")}</p>
            {error && <FieldError>{error}</FieldError>}
            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {t("submit")}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
