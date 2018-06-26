# Meet Hubert

This is a PoC application of web-based augmented reality. 
It aims to show how easy it is to use your phone as an AR device.

The 3D model is Hubert, [https://voucherify.io](voucherify.io) mascot, prepared by [Mateusz Mrowiec](https://github.com/Haggus).

It uses:
  - [AR.js](https://github.com/jeromeetienne/AR.js)
  - [aframe](https://aframe.io) - this is used by AR.js :)

Browser requirements (as of June 2018):

On Android latest Chrome and Firefox browsers have appropriate API 
On iOS users are required to use the Safari browser (iOS imposes some API restrictions on browser other than Safari)

A practical application of this was done during [DevoxxPL](http://devoxx.pl/) conference at 2018.
It can be seen on `devoxx_contest` branch. On that branch twitter authentication code is used
(which is dead here on `master`). On there we capture camera frame and the aframe scene to create
a photo of the 3D model. This was then tweeted with certain hashtags.
All people who tweeted Hubert's photo entered a lottery.
