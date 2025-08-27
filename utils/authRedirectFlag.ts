let skipNextAuthRedirect = false;

export function setSkipNextAuthRedirect(value: boolean) {
  skipNextAuthRedirect = value;
}

export function getSkipNextAuthRedirect() {
  return skipNextAuthRedirect;
}
