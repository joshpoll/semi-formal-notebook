# Semi-Formal Notebook

Implementation inspired by percival.ink.

## Running this

We're using `bun` so install that. Run `bun install` in the repo. Run `bun dev` to run. Optionally
change the port it runs on with `bun dev --port=XXXX`.

You'll need to add an OpenAI API Key to a top-level `.env.local` file. That file should look like
this:

```
NEXT_PUBLIC_API_KEY="sk-proj-..."
```

## Cells (random thoughts... not reflective of actual implementation)

Each cell has a semi-formal canvas specification region, a data region, and a view region.

(Data is essentially a formal, text-based kind of view like a traditional program. It _is_ a
traditional program.)

There are four kinds of cells:

- **Data:** e.g. `{foo: "bar"}`. has a view that can modify the data
- **Computed:** e.g. `dataset.foo`. has a view but it _cannot_ modify the data since it is computed
  in terms of other cells
- **Function:** e.g. `def baz(): ...`. doesn't have a view for now. if it did have a view I think it would
  be explaining the code and not allow modification
- **View:** e.g. data vis. a data or computed cell that returns HTML. in contrast to data and
  computed cells, which use auto-generated views that cannot be modified, this cell specifies a custom view

**TODOs:** I'm not sure if these cell types really make sense. They may be imposing artificial
boundaries. For example, maybe a function's view could modify some constant inside that function's
body? Why put arbitrary restrictions on editing views? It's for simplicity but maybe it's more
annoying than it's worth.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
