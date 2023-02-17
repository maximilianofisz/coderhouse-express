import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
const port = 8000;

const colors: string[] = []

function render(){
    let output = ""
    colors.forEach((color) => {
        output = output + `<li style="color: ${color}">${color}</li>` 
    })
    const html = `
    <html>
        <style>
            body {
            background-color: #000000;
            color: white;
            }
        </style>
        <body>
            <h1>Add a colour!</h1>
            <form method="POST"><input type="text" name="color" / ></form>
            <ul>
                ${output}
            </ul>
        </body>
        
    </html>`
    return html
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method == "POST") {
    // * application/json
    const body = await req.text();
    const input = body.split("=")[1]
    colors.push(input)
    return new Response(render(), {
        status: 200,
        headers: {
          "content-type": "text/html; charset=UTF-8",
        },
    });
  }
    else {
    return new Response(
        render(),
      {
        headers: {
          "content-type": "text/html; charset=UTF-8",
        },
      }
    );
  }
};
await serve(handler, { port });