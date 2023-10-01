import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    // default undefined, means if this function called without any params, it means its the first page, when we add cursor to it, it work as a pagination, for details see below
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam, // pagination on cursor
          [paramKey]: paramValue,
        },
      },
      { skipNull: true } // to exclude any properties from the query string that have null values,  Check Below
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      // refetchInterval: 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// PAGEPARAMS ------->

/*
   
The `pageParam = undefined` in the function argument is a default parameter value. This means that if no argument is provided when the `fetchMessages` function is called, `pageParam` will default to `undefined`.

In our code, `pageParam` is used as the cursor for pagination. When you fetch the first page of data, you don't have a cursor yet, so `pageParam` should be `undefined`. For subsequent pages, `pageParam` would be the cursor value returned from the previous page.

So, by setting `pageParam = undefined`, we're saying "if no cursor is provided when this function is called, assume it's the first page". This is a common pattern for implementing pagination in APIs.

*/

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
NOTE -> {skipNull: true}

In our code, this means that if either pageParam or [paramKey] is null, it won’t be included in the constructed URL. This can be useful if we don’t want to send parameters with null values to the API.

So, when qs.stringifyUrl is called, it constructs a URL from the provided url and query parameters, but it skips any query parameters that have null values because of { skipNull: true }. This results in a cleaner URL that only includes the parameters with meaningful values.


*/

// /**/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/* */

/* 
 NOTE:

The code above is using the `useInfiniteQuery` hook from the `@tanstack/react-query` library and the `qs` library to fetch chat messages in a paginated manner from an API. Here's a detailed breakdown:

- `useInfiniteQuery`: This hook is used to fetch data in pages, which is useful for implementing features like infinite scrolling. It fetches the first page of data by default and provides functions to fetch more pages¹.

- `qs`: This library provides utilities for parsing and formatting URL query strings⁶. In this code, it's used to construct the URL for fetching chat messages.

Now, let's break down the `useChatQuery` function:

1. **Parameters**: The function takes an object as a parameter, which includes:
   - `queryKey`: A unique key for the query.
   - `apiUrl`: The base URL of the API.
   - `paramKey`: The key for the parameter to be included in the API request (either "channelId" or "conversationId").
   - `paramValue`: The value for the parameter to be included in the API request.

2. **fetchMessages Function**: This asynchronous function is used to fetch chat messages from the API. It takes an object as a parameter, which includes a `pageParam` that defaults to `undefined`. This function constructs the URL for the API request using `qs.stringifyUrl`, sends a GET request to this URL, and returns the response as JSON.

3. **useInfiniteQuery Hook**: This hook is called with an object that includes:
   - `queryKey`: An array containing the unique key for the query.
   - `queryFn`: The function to fetch data (i.e., `fetchMessages`).
   - `getNextPageParam`: A function that returns the cursor for the next page of data. It takes the last page of data as a parameter and returns the `nextCursor` property of this page.
   - `refetchInterval`: If `isConnected` is true, it won't refetch; otherwise, it will refetch every 1000 milliseconds.

4. **Return Statement**: The function returns an object that includes:
   - `data`: The data fetched by the query.
   - `fetchNextPage`: A function to fetch the next page of data.
   - `hasNextPage`: A boolean indicating whether there is a next page of data.
   - `isFetchingNextPage`: A boolean indicating whether the next page of data is currently being fetched.
   - `status`: The status of the query.

In summary, this code sets up an infinite query with React Query to fetch chat messages from an API in a paginated manner. It uses a state from a socket provider to determine whether to refetch data at regular intervals. The fetched data, along with some other properties and methods, are returned by the custom hook and can be used in other parts of the application.


*/
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
