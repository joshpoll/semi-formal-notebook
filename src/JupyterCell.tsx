"use client";

import { Cell, Jupyter } from "@datalayer/jupyter-react";

export const JupyterCell = () => {
  return (
    <Jupyter
      jupyterServerHttpUrl="https://oss.datalayer.tech/api/jupyter"
      jupyterServerWsUrl="wss://oss.datalayer.tech/api/jupyter"
      jupyterToken="60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
    >
      <Cell
        source={`import numpy as np

# The first function is for sampling t_i from a uniform distribution.
def stratified_sampling(t_n, t_f, N, i):
  return np.random.uniform(
    t_n + (i - 1)/N * (t_f - t_n),
    t_n + i/N * (t_f - t_n)
  )

# The second function is the quadrature rule used to estimate C(r).
def quadrature_rule(N, c, sigma):
  C_hat_r = 0
  for i in range(1, N+1):
    # delta_i is the distance between adjacent samples
    delta_i = sigma[i] - sigma[i-1] if i > 0 else sigma[i]
    T_i = np.exp(-np.sum(sigma[:i] * delta_i))
    C_hat_r += T_i * (1 - np.exp(-sigma[i] * delta_i)) * c[i-1]
  return C_hat_r`}
      />
    </Jupyter>
  );
};

export default JupyterCell;
