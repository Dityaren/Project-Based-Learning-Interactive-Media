import { Button } from "@repo/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { toast } from "@repo/ui/components/toast";
import { useForm } from "@tanstack/react-form";

export default function CreateProjectForm() {
  const form = useForm({
    defaultValues: {
      project_name: "",
      project_description: "",
    },
    onSubmit: async ({ value }) => {
      try {
        toast.add({
          type: "info",
          description: (
            <>
              {" "}
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(value, null, 2)}</code>
              </div>
            </>
          ),
        });
      } catch (error) {
        console.error("Form submission error", error);
        toast.add({ type: "error", description: "ada yang salah cik" });
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="mx-auto max-w-3xl py-10"
    >
      <FieldGroup>
        <form.Field
          name="project_name"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Project Name</FieldLabel>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="Project Name"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>This is your project display name.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="project_description"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Project Description</FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder="Tell us a little bit about the project"
                  className="resize-none"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>This is your project display description</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </FieldGroup>
    </form>
  );
}
