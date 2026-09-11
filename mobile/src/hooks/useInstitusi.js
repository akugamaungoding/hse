import { institusiServices } from "@/services/institusiServices";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useInstitusi = (params) => {
  return useQuery({
    queryKey: ["institusi", params],
    queryFn: () => institusiServices.get(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
};

export const useDetailInstitusi = (id) => {
  return useQuery({
    queryKey: ["institusi", "detail", id],
    queryFn: () => institusiServices.getDetail(id),
    enabled: !!id,
  });
};

export const useCreateInstitusi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institusiServices.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institusi"],
      });
    },
  });
};

export const useUpdateInstitusi = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => institusiServices.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institusi"],
      });
      queryClient.invalidateQueries({
        queryKey: ["institusi", "detail", id],
      });
    },
  });
};

export const useDeleteInstitusi = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => institusiServices.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institusi"],
      });
    },
  });
};
