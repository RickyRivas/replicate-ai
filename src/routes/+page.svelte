<script>
  import { enhance } from "$app/forms"
  let imagePrompt = ""
  let loading = false
</script>

<main>
  <!-- input -->
  <div class="form-container">
    <h2>Generate an image</h2>
    <form
      action="?/generateImg"
      method="post"
      use:enhance={({ cancel }) => {
        console.log("submitted form...")
        return async ({ result }) => {
          const data = result.data.data
          console.log("submission complete. final response:", data)
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
  </div>

  <!-- output -->
  <div class="generated-output"></div>
</main>
