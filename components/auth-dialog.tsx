import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {Button} from './ui/button';
import {Separator} from './ui/separator';
import Link from 'next/link';

function AuthDialog({
  dialogTrigger,
  title,
  description,
}: {
  dialogTrigger: React.ReactNode;
  title?: string;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger>{dialogTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? 'Login Required'}</DialogTitle>
          <DialogDescription>You must be logged in to {description}.</DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <DialogFooter className="flex md:flex-row flex-col gap-3">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">Log In</Button>
          </Link>
          <Link href="/auth/sign-up" className="w-full">
            <Button variant="outline" className="w-full">
              Sign Up
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;
