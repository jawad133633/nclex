import type { ReactElement } from "react";
import { StudentDashboard } from "@/features/student";

const AccountPage = (): ReactElement => <StudentDashboard initialTab="account" />;

export default AccountPage;
