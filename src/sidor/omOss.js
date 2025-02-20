import React from "react";
const OmOss = () => {
  return (
    <body>
      <h1 id="omOssHead">Om oss</h1>

      <div id="bodyOmOss">
        <h2>
          Skola77 är ett bordsplaceringsprogram utvecklat av en grupp ungdomar.
          Vi tycker det är självklart att lärare ska ha tillgång till välgjorda
          och effektiva verktyg för att kunna skapa trygghet och arbetsro i
          klassrummen. Det är därför vårt bordsplaceringsprogram är utvecklat
          med lärare i åtanke. Dessutom är vår hemsida helt gratis och utan
          reklam.
        </h2>

        <div class="users-container">
          <div class="user-container">
            <div class="user-icon">A</div>
            <div class="user-info">
              <div class="user-name">Artur Norrby</div>
              <div class="user-role">Utvecklare</div>
            </div>
          </div>

          <div class="user-container">
            <div class="user-icon">B</div>
            <div class="user-info">
              <div class="user-name">Bo Gustavsson</div>
              <div class="user-role">Utvecklare</div>
            </div>
          </div>

          <div class="user-container">
            <div class="user-icon">O</div>
            <div class="user-info">
              <div class="user-name">Oscar Brännström</div>
              <div class="user-role">Arbetare</div>
            </div>
          </div>

          <div class="user-container">
            <div class="user-icon">S</div>
            <div class="user-info">
              <div class="user-name">Samuel Nordin</div>
              <div class="user-role">Arbetare</div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};
export default OmOss;
