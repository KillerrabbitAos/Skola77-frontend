function omvandlaData() {
  function placeringsOmvandling(data, klassId) {
    function generateUniqueId() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }

    let grid = Array.from({ length: data.rows }, () =>
      Array.from({ length: data.columns }, () => ({ id: null, person: 0 }))
    );

    data.boxNames = data.boxNames.map((box) => {
      match = data.keyChange.find((change) => change.key === box.key);
      if (match) {
        return { key: match.value, value: box.value };
      } else {
        return box;
      }
    });

    grid = grid.map((rad, radIndex) =>
      rad.map((ruta, kolumnIndex) => {
        var match = data.boxNames.find(
          (box) =>
            parseInt(box.key.split("-")[1]) ===
            radIndex * data.columns + kolumnIndex
        );
        if (match) {
          return { id: generateUniqueId(), person: match.value };
        } else if (
          data.filledBoxes.some(
            (box) =>
              parseInt(box.split("-")[1]) ===
              radIndex * data.columns + kolumnIndex
          )
        ) {
          {
            return {
              id: generateUniqueId(),
              person: 0,
            };
          }
        } else {
          return ruta;
        }
      })
    );

    return {
      id: generateUniqueId(),
      namn: data.names,
      klassrum: {
        id: klassrumsId,
        namn: klassrumsnamn,
        grid: grid,
        cols: data.columns,
        rows: data.rows,
      },
      klass: { id: klassId, namn: klassnamn, personer: data.personer },
    };
  }
}
