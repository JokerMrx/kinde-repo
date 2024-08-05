"use client";
import { useState } from "react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

interface Props {
  organizations: Organization[];
  currentOrgCode: string;
}

const SelectOrganization = ({ currentOrgCode, organizations }: Props) => {
  const [selectedOrg, setSelectedOrg] = useState(currentOrgCode);
  const { getClaim } = useKindeAuth();
  const handleChange = (orgCode: string) => {
    setSelectedOrg(orgCode);
  };
  console.log(getClaim("organizations", "id_token")?.value);

  return (
    <Select value={selectedOrg} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Organizations" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <LoginLink key={org.code} orgCode={org.code}>
            <SelectItem key={org.code} value={org.code}>
              {org.name}
            </SelectItem>
          </LoginLink>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectOrganization;
