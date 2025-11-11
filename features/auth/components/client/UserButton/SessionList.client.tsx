"use client";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./UserAvatar.client";
import type { DeviceSession } from "../../../lib/types";

interface SessionListProps {
  sessions: DeviceSession[];
  currentToken: string;
  onSwitchSession: (token: string) => void;
}

export function SessionList({
  sessions,
  currentToken,
  onSwitchSession,
}: SessionListProps) {
  const otherSessions = sessions.filter(
    (s) => s.session.token !== currentToken
  );

  if (otherSessions.length === 0) return null;

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Tài khoản khác</DropdownMenuLabel>
      {otherSessions.map((sessionData) => {
        const sessionUser = sessionData.user;

        return (
          <DropdownMenuItem
            key={sessionData.session.token}
            onClick={() => onSwitchSession(sessionData.session.token)}
            className="cursor-pointer"
          >
            <UserAvatar
              image={sessionUser.image}
              name={sessionUser.name}
              email={sessionUser.email}
              username={sessionUser.username}
              size="sm"
            />
            <div className="flex flex-col ml-2">
              <span className="text-sm">{sessionUser.name}</span>
              <span className="text-xs text-muted-foreground">
                @{sessionUser.username || sessionUser.email || "user"}
              </span>
            </div>
          </DropdownMenuItem>
        );
      })}
    </>
  );
}
