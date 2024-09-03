<script>
  import { enhance } from "$app/forms"
  let imagePrompt = ""
  let loading = false
  let success = false
  let failure = false
  let outputImgSrc = ""
  let output = ""

  async function showOutputImage(output) {
    // only pass one image
    const response = await fetch(output)
    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    // Convert the response to a Blob
    const imageBlob = await response.blob()
    // Create a URL from the Blob
    outputImgSrc = URL.createObjectURL(imageBlob)
  }

  function reset() {
    outputImgSrc = ""
    success = false
    failure = false
    output = ""
    loading = true
  }
</script>

<main>
  <!-- input -->
  <div class="form-container">
    <h2>Generate an image</h2>
    <form
      action="?/generateImg"
      method="post"
      use:enhance={({ cancel }) => {
        reset()
        console.log("submitted form...")
        return async ({ result }) => {
          console.log("form action result:", result)

          if (result.type === "failure") {
            success = failure
            failure = true
            output = result.data.message
            loading = false
          } else {
            success = true
            failure = false
            output = result.data.output[0]
            showOutputImage(output)
            loading = false
          }
        }
      }}>
      <div class="form-control">
        <label class="label" for="">
          What would you like to generate?
          <input type="text" class="input" name="image-prompt" required bind:value={imagePrompt} />
        </label>
      </div>
      <button class="btn">generate</button>
    </form>

    <!-- output -->
    {#if !loading && output}
      {#if success}
        <h2>Output</h2>
        <div class="generated-output">
          <h3>Generated Image:</h3>
          <img src={outputImgSrc} alt="" />
          <p>Output data: {output}</p>
        </div>
      {/if}
      {#if failure}
        <p>There was an error: {output}</p>
      {/if}
    {/if}

    {#if loading}
      <p>Generating your image...</p>
    {/if}
  </div>
</main>
