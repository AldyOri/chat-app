type setCookieProps = {
  name: string;
  value: string;
  expiredDurationInDay: number;
};

type GetCookieProps = {
  name: string;
};

type DeleteCookieProps = {
  name: string;
};

export function setCookie({
  name,
  value,
  expiredDurationInDay,
}: setCookieProps) {
  let expires = "";
  if (expiredDurationInDay) {
    const date = new Date();
    date.setTime(date.getTime() + expiredDurationInDay * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie({ name }: GetCookieProps) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie({ name }: DeleteCookieProps) {
  document.cookie = name + "=; Max-Age=-99999999; path=/";
}
