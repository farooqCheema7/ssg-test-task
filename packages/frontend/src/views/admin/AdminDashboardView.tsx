import { FunctionComponent, PropsWithChildren } from "react";

type Props = {};

export const AdminDashboardView: FunctionComponent<
  PropsWithChildren<Props>
> = ({ children }) => {
  return (
    <main className="flex-1 bg-white flex items-center justify-center">
      <p className="text-xl text-gray-700">Admin dashboard view!</p>
    </main>
  );
};
