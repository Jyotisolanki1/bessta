import { useEffect } from 'react';
import Faq from 'react-faq-component';
import { GetFaqApi } from '../../Slices/FaqSlice';
import { useDispatch, useSelector } from 'react-redux';

const styles = {
  bgColor: 'white',
  titleTextColor: '#f28500',
  rowTitleColor: 'blue',
  rowContentColor: 'grey',
  arrowColor: '#f28500'
};

const config = {
  // animate: true,
  // arrowIcon: "V",
  // tabFocus: true
};

export default function FAQ() {
  const { FaqObj } = useSelector((state) => state.FaqAction);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetFaqApi());
  }, []);

  const formattedData = FaqObj.map((item) => ({
    title: item.title,
    content: item.content
  }));

  const data = {
    title: 'FAQ (How it works)',
    rows: formattedData
  };

  return (
    <div className="faqs">
      <div style={{ marginTop: '10em', marginRight: '7%', marginLeft: '7%' }}>
        {data ? <Faq data={data} styles={styles} config={config} /> : 'not found'}
      </div>
    </div>
  );
}
