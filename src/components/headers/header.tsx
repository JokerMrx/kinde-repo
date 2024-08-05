import {
  LoginLink,
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/types/nav-types";
import { AlignJustify } from "lucide-react";
import { Icons } from "../icons";
import { Button } from "@/components/ui/button";
import UserNav from "../nav/user-nav";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import SelectOrganization from "./select-organization";
import { getProject } from "@/services/projects.api";

interface HeaderProps {
  menuItems?: SidebarNavItem[];
}

const Header = async ({ menuItems }: HeaderProps) => {
  const { getUser, isAuthenticated, getOrganization, getUserOrganizations } =
    getKindeServerSession();
  const user = await getUser();
  const org = await getOrganization();
  const userOrg = await getUserOrganizations();
  let userOrganizations: Organization[] = [];
  let projectNamespace = "";

  try {
    if (org?.orgCode) {
      const project = await getProject();

      projectNamespace = project.namespace;
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <header className="bottom-1 border">
      <nav className="border-gray-200 bg-white px-2 py-2.5 sm:px-4">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between text-base">
          <h1>Project Repo</h1>
          <div>
            {(await isAuthenticated()) && user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {org?.orgCode && userOrg && userOrg.orgs.length > 1 && (
                  <div className="w-[180px] hidden md:block">
                    <SelectOrganization
                      currentOrgCode={org.orgCode}
                      organizations={userOrg.orgs}
                    />
                  </div>
                )}
                {user.given_name && user.picture && (
                  <UserNav
                    name={`${user.given_name} ${user.family_name}`}
                    image={user.picture}
                    email={user.email ?? ""}
                  >
                    {org?.orgCode && userOrganizations.length > 1 && (
                      <div className="block md:hidden">
                        <DropdownMenuItem
                          className="flex w-full items-center justify-between"
                          asChild
                        >
                          <SelectOrganization
                            currentOrgCode={org.orgCode}
                            organizations={userOrganizations}
                          />
                        </DropdownMenuItem>
                      </div>
                    )}
                    <DropdownMenuItem
                      className="flex w-full items-center justify-between"
                      asChild
                    >
                      <LogoutLink>
                        <Button className="w-full" type="submit">
                          Sign out
                        </Button>
                      </LogoutLink>
                    </DropdownMenuItem>
                  </UserNav>
                )}

                {menuItems && (
                  <div className="block md:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">
                          <AlignJustify />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className="my-10 flex flex-col gap-2">
                          {menuItems.map((item, index) => {
                            const Icon = Icons[item?.icon || "list"];
                            return (
                              item.href && (
                                <SheetClose key={index} asChild>
                                  <Link
                                    href={
                                      item.disabled ? "/view-forms" : item.href
                                    }
                                  >
                                    <span
                                      className={cn(
                                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                        item.disabled
                                          ? "cursor-not-allowed opacity-80"
                                          : "cursor-pointer"
                                      )}
                                    >
                                      <Icon className="mr-2 h-4 w-4" />
                                      {item.title}
                                    </span>
                                  </Link>
                                </SheetClose>
                              )
                            );
                          })}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                )}
              </div>
            ) : (
              <LoginLink>
                <Button>Sign in</Button>
              </LoginLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
