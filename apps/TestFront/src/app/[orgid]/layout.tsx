'use client';

import { Key } from 'react';
import { useRouter } from 'next/navigation';
import { Divider, Listbox, ListboxItem } from '@nextui-org/react';

export default function OrgLayout({
  params,
  children,
}: {
  params: { orgid: string };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const routes = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      address: 'dashboard',
    },
    {
      key: 'chart',
      label: 'Org chart',
      address: 'orgchart',
    },
  ];

  const navigateTo = (key: Key) => {
    const route = routes.find((route) => route.key === key);
    console.log('params.orgid >>> ', params.orgid);
    if (route) {
      router.push(`/${params.orgid}/${route.address}`);
    }
  };
  return (
    <div className="grid grid-cols-6 h-full">
      <aside className="col-span-1 flex flex-row justify-between h-full bg-red">
        <Listbox
          items={routes}
          aria-label="Dynamic Actions"
          onAction={(key) => navigateTo(key)}
        >
          {(item) => (
            <ListboxItem
              key={item.key}
              color={item.key === 'delete' ? 'danger' : 'default'}
              className={item.key === 'delete' ? 'text-danger' : ''}
            >
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
        <Divider orientation="vertical"></Divider>
      </aside>
      <div className="col-span-5">{children}</div>
    </div>
  );
}
