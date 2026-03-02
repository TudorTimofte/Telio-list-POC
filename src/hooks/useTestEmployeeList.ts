import { useEffect, useState, useCallback } from 'react';

const API_URL = 'testemployee/list';

const DEFAULT_PAYLOAD = {
  Columns: [
    { ColumnName: 'FirstName', Visible: true },
    { ColumnName: 'LastName', Visible: true },
    { ColumnName: 'AssignedTo', Visible: true },
    { ColumnName: 'Salary', Visible: true },
    { ColumnName: 'Age', Visible: true },
    { ColumnName: 'LastLogin', Visible: true }
  ],
  FilterJson: '',
  Sortings: [
    { ColumnName: 'LastName', Direction: 1 }
  ],
  Paging: { CurrentPage: 1, PageSize: 10 }
};

export default function useTestEmployeeList({ page = 1, pageSize = 10 } = {}) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (pageArg = page, pageSizeArg = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...DEFAULT_PAYLOAD,
        Paging: { CurrentPage: pageArg, PageSize: pageSizeArg }
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      setData(Array.isArray(result.Data) ? result.Data : []);
      setCount(result.Count || 0);
    } catch (err) {
      setError(err);
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize, fetchData]);

  return { data, count, loading, error, fetchData };
}
