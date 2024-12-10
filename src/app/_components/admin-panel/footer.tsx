import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full bg-background shadow backdrop-blur border-t-[1px]">
      <div className="mx-4 flex h-14 items-center md:mx-8">
        <p className="text-left text-xs leading-loose text-muted-foreground md:text-sm">
          TwinCare was made for the{" "}
          <Link
            href="https://afech.devpost.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            VyuhaTech Hackathon
          </Link>
          . {" "}
          <Link
            href="httpsmat/sicklesense"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
