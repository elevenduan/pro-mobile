import type { FC, ReactNode } from "react";
import { useEffect, useState, useRef } from "react";
import { PullToRefresh, InfiniteScroll } from "antd-mobile";
import { ProEmpty } from "../ProEmpty";

export type ProScrollListProps = {
  children?: (data: any[]) => ReactNode;
  empty?: ReactNode;
  api: (ops: any) => Promise<any>;
  params: any;
  setParams: (ops: any) => void;
  condition?: () => boolean;
  refresh?: number;
  names?: {
    res?: string;
    data?: string;
    current?: string;
    size?: string;
    total?: string;
    pages?: string;
  };
  getRes?: (res: any) => void;
};

export const ProScrollList: FC<ProScrollListProps> = (props) => {
  const { children, empty, api, params, setParams, condition, refresh, names, getRes } = props;
  const {
    res: nameRes = "",
    data: nameData = "data",
    pages: namePages = "pages",
    current: nameCurrent = "current",
    size: nameSize = "size",
    total: nameTotal = "total",
  } = names || {};
  const [hasMore, setHasMore] = useState(false);
  const [list, setList] = useState<any[]>();
  const skip = useRef(false);

  async function fetchData(ops: any) {
    if (condition && !condition()) return;
    await api(ops).then((resp: any) => {
      const res = (nameRes ? resp[nameRes] : resp) || {};
      const data = res[nameData] || [];
      setHasMore(ops[nameCurrent] < res[namePages] || ops[nameCurrent] * ops[nameSize] < res[nameTotal]);
      setList(!ops[nameCurrent] || ops[nameCurrent] === 1 ? data : [...(list || []), ...data]);
      getRes?.(resp);
    });
  }

  async function handleCurrent(cur: number) {
    const newParams = { ...params, [nameCurrent]: cur };
    await fetchData(newParams);
    skip.current = true;
    setParams(newParams);
  }

  async function onRefresh() {
    await handleCurrent(1);
  }

  async function loadMore() {
    await handleCurrent(params[nameCurrent] + 1);
  }

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    fetchData(params);
  }, [params]);

  useEffect(() => {
    if (!refresh || refresh <= 0) return;
    onRefresh();
  }, [refresh]);

  return (
    <PullToRefresh onRefresh={onRefresh}>
      {list?.length ? (
        <>
          {children?.(list)}
          {children ? <InfiniteScroll loadMore={loadMore} hasMore={hasMore} /> : null}
        </>
      ) : list === undefined ? null : (
        empty || <ProEmpty />
      )}
    </PullToRefresh>
  );
};
