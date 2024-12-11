/* eslint-disable react/prop-types */
import './Carousel.css';

// eslint-disable-next-line react/prop-types
export const Carousel = ({ eachDraw }) => {
  const data = [];
  // eslint-disable-next-line react/prop-types
  eachDraw?.winner?.forEach((winner, index) => {
    // Assuming the indexes in eachDraw.winner and eachDraw.prizes correspond to each other
    // eslint-disable-next-line react/prop-types
    const prize = eachDraw?.prizes[index];
    const newData = {
      firstname: winner?.firstname,
      lastname: winner?.lastname,
      number: winner?.number,
      description: prize?.description
    };
    data.push(newData);
  });

  return (
    <div>
      {data.map((item, idx) => (
        <div key={idx}>
          <p>
            {idx === 0 ? (
              <p>
                {idx + 1}st prize {item?.description} : {item?.firstname + ' ' + item?.lastname}
              </p>
            ) : idx === 1 ? (
              <p>
                {idx + 1}nd prize {item?.description} : {item?.firstname + ' ' + item?.lastname}
              </p>
            ) : idx === 2 ? (
              <p>
                {idx + 1}rd prize {item?.description} : {item?.firstname + ' ' + item?.lastname}
              </p>
            ) : (
              ''
            )}
          </p>
        </div>
      ))}
      <br />
    </div>
  );
};

export const Carousel2 = ({ eachDraw }) => {
  console.log('eachDraw', eachDraw);
  const data = [];
  // eslint-disable-next-line react/prop-types
  eachDraw?.winners?.forEach((winner, index) => {
    // Assuming the indexes in eachDraw.winner and eachDraw.prizes correspond to each other
    // eslint-disable-next-line react/prop-types

    const newData = {
      firstname: winner?.name,
      number: winner?.number,
      description: winner?.prize
    };
    data.push(newData);
  });

  return (
    <div>
      {eachDraw?.winners?.map((item, idx) => (
        <div key={idx}>
          <p>
            {idx === 0 && item?.name ? (
              <p>
                {item?.name ? (
                  <>
                    {idx + 1}st prize {item?.prize} : {item?.name}
                  </>
                ) : (
                  ''
                )}
              </p>
            ) : idx === 1 ? (
              <p>
                {item?.name ? (
                  <>
                    {idx + 1}st prize {item?.prize} : {item?.name}
                  </>
                ) : (
                  ''
                )}
              </p>
            ) : idx === 2 ? (
              <p>
                {item?.name ? (
                  <>
                    {idx + 1}st prize {item?.prize} : {item?.name}
                  </>
                ) : (
                  ''
                )}
              </p>
            ) : (
              ''
            )}
          </p>
        </div>
      ))}
      <br />
    </div>
  );
};
