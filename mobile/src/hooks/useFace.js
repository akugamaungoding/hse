import { faceServices } from "@/services/faceServices";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRegisterFace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: faceServices.register,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["face"],
      });
    },
  });
};

export const useVerifyFace = () => {
  return useMutation({
    mutationFn: faceServices.verify,
  });
};

export const useTrainFace = () => {
  return useMutation({
    mutationFn: faceServices.train,
  });
};
