// Only do the userfile thing, if the user's browser supports necessary features
if (window.File && window.FileReader && window.FileList) {
	
  // TODO: Have to validate that this is a valid sound file somehow. Might only be possible to check file extension right now.
	function addAudio(name, file){
		var reader = new FileReader();
		reader.onload = function(event) {
			const source = event.target.result;
      var newSample = { name, source };
      samples.push(newSample);
      drawMixer();
		}
    //when the file is read it triggers the onload event we just defined above.
		reader.readAsDataURL(file);
	}

  // Grab a few elements off of the page
  const $addSampleForm = document.querySelector("#add-sample-form");
  const $addSampleName = document.querySelector('#add-sample-name');
  const $addSampleFile = document.querySelector('#add-sample-file');

  // Since filesystem capability exists on this browser, user can use this form.
  $addSampleForm.classList.remove("hidden");
	$addSampleForm.addEventListener('submit', function(e) {
    // Don't let the form submit. (This is an SPA afterall.)
    e.preventDefault();
		//grab the first image in the fileList (a user could hypothetically control-click multiple files in the chooser.)
		addAudio($addSampleName.value, $addSampleFile.files[0]);
    // Clear form
    $addSampleName.value = $addSampleFile.value = null;
	});

} else {
  // Tell the user that their browser isn't worthy of this fine piece of machinery.
  alert('The File APIs required to enjoy all features of this application are not fully supported in this browser.');
}
