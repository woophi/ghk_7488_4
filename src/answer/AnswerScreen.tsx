import { AmountInput } from '@alfalab/core-components/amount-input/cssm';

import { Button } from '@alfalab/core-components/button/cssm';
import { Gap } from '@alfalab/core-components/gap/cssm';
import { Tag } from '@alfalab/core-components/tag/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import { ChevronLeftMIcon } from '@alfalab/icons-glyph/ChevronLeftMIcon';
import { StarMIcon } from '@alfalab/icons-glyph/StarMIcon';
import { UsersMIcon } from '@alfalab/icons-glyph/UsersMIcon';
import { useEffect, useState, type ComponentType } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { appSt } from '../style.css';
import type { QuestionItem } from '../types';
import { getAnswerTone } from '../utils/tone';
import { answerSt } from './style.css';

type AnswerScreenProps = {
  question: QuestionItem;
  answer: 'yes' | 'no';
  GaugeChartComponent: ComponentType<Record<string, unknown>> | null;
  onBack: () => void;
  setAnswerData: React.Dispatch<React.SetStateAction<{ question: QuestionItem; answer: 'yes' | 'no' } | null>>;
};

const formatRub = (value: number) => (
  <>
    <b>{value.toLocaleString('ru-RU')}</b>{' '}
    <Typography.Text view="secondary-large" color="secondary">
      ₽ кешбэка
    </Typography.Text>
  </>
);

const inputChips = [100, 200, 300];

export const AnswerScreen = ({ question, answer, onBack, setAnswerData }: AnswerScreenProps) => {
  const [sum, setSum] = useState(inputChips[0]);
  const [error, setError] = useState('');
  const selectedCoeff = answer === 'yes' ? question.yesX : question.noX;
  const commission = Math.round(sum * 0.02);
  const winAmount = Math.round(sum * selectedCoeff);

  useEffect(() => {
    window.gtag('event', '7488_event_impression', { var: 'var4', question: question.question });
  }, []);

  const handleChangeInput = (_: React.ChangeEvent<HTMLInputElement> | null, { value }: { value: number | null }) => {
    if (error) {
      setError('');
    }
    setSum(value ?? 0);
  };

  const submit = () => {
    window.gtag('event', '7488_bet_click', { var: 'var4', question: question.question, answer, bet_size: String(sum) });
    window.location.replace(
      'alfabank://sdui_screen?screenName=InvestmentLongread&fromCurrent=true&shouldUseBottomSafeArea=true&endpoint=v1/invest-main-screen-view/investment-longread/98955%3flocation=AM%26campaignCode=GH',
    );
  };

  return (
    <div className={appSt.page}>
      <div className={appSt.hero}>
        <div className={answerSt.topMeta}>
          <span className={answerSt.chip}>
            <StarMIcon className={answerSt.chipIcon} />
            <Typography.Text tag="span" view="secondary-small" weight="medium">
              {question.category}
            </Typography.Text>
          </span>
          <span className={answerSt.chip}>
            <UsersMIcon className={answerSt.chipIcon} />
            <Typography.Text tag="span" view="secondary-small" weight="medium">
              {question.voters.toLocaleString('ru-RU')} проголосовало
            </Typography.Text>
          </span>
        </div>

        <Typography.Title tag="h1" view="medium" weight="semibold" font="system">
          {question.question}
        </Typography.Title>
      </div>
      <section className={appSt.feedSection}>
        <div className={answerSt.content}>
          <section className={answerSt.sectionCard} style={{ backgroundColor: 'transparent', paddingTop: 0 }}>
            <Typography.Text
              tag="p"
              view="primary-medium"
              defaultMargins={false}
              weight="bold"
              className={answerSt.sectionTitle}
            >
              Выберите сторону
            </Typography.Text>

            <div className={answerSt.chooseRow}>
              <button
                type="button"
                className={answer === 'yes' ? answerSt.chooseButtonActive : answerSt.chooseButton}
                onClick={() => setAnswerData({ question, answer: 'yes' })}
              >
                <Typography.Title
                  tag="h3"
                  view="medium"
                  weight="semibold"
                  font="system"
                  color={getAnswerTone(question, 'yes')}
                >
                  Да
                </Typography.Title>
                <Typography.Text
                  tag="span"
                  view="secondary-small"
                  className={answerSt.coeffText}
                  color={answer === 'yes' ? 'primary-inverted' : 'primary'}
                >
                  ×{question.yesX.toFixed(2)}
                </Typography.Text>
              </button>

              <button
                type="button"
                className={answer === 'no' ? answerSt.chooseButtonActive : answerSt.chooseButton}
                onClick={() => setAnswerData({ question, answer: 'no' })}
              >
                <Typography.Title
                  tag="h3"
                  view="medium"
                  weight="semibold"
                  font="system"
                  color={getAnswerTone(question, 'no')}
                >
                  Нет
                </Typography.Title>
                <Typography.Text
                  tag="span"
                  view="secondary-small"
                  className={answerSt.coeffText}
                  color={answer === 'no' ? 'primary-inverted' : 'primary'}
                >
                  ×{question.noX.toFixed(2)}
                </Typography.Text>
              </button>
            </div>
          </section>

          <img src={answer === 'yes' ? question.graphData.imgYes : question.graphData.imgNo} />

          <section className={answerSt.sectionCard}>
            <div className={answerSt.eventRow}>
              <Typography.Text
                tag="p"
                view="primary-medium"
                defaultMargins={false}
                weight="bold"
                className={answerSt.sectionTitle}
              >
                О событии
              </Typography.Text>
            </div>

            <Typography.Text tag="p" view="primary-medium" defaultMargins={false} className={answerSt.eventText}>
              {question.description}
            </Typography.Text>
          </section>

          <section className={answerSt.sectionCard}>
            <AmountInput
              label="Размер ставки"
              labelView="outer"
              value={sum}
              error={error}
              onChange={handleChangeInput}
              block
              minority={1}
              bold={false}
              min={inputChips[0]}
              suffix="₽ кэшбека"
            />

            <Swiper slidesPerView="auto" spaceBetween={8} style={{ marginTop: '.5rem' }}>
              {inputChips.map(category => (
                <SwiperSlide key={category} className={appSt.filterSlide}>
                  <Tag size="xxs" view="filled" shape="rectangular" onClick={() => setSum(category)}>
                    {category} ₽ кэшбека
                  </Tag>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          <section className={answerSt.sectionCard}>
            <Typography.Text
              tag="p"
              view="primary-small"
              defaultMargins={false}
              color="secondary"
              className={answerSt.sectionTitle}
            >
              Расчёт
            </Typography.Text>

            <div className={answerSt.calcRows}>
              <div className={answerSt.calcRow}>
                <Typography.Text tag="span" view="secondary-large" color="secondary">
                  Ставка
                </Typography.Text>
                <Typography.Text tag="span" view="primary-medium" className={answerSt.calcValue}>
                  {formatRub(sum)}
                </Typography.Text>
              </div>

              <div className={answerSt.calcRow}>
                <Typography.Text tag="span" view="secondary-large" color="secondary">
                  Коэффициент ({answer === 'yes' ? '«Да»' : '«Нет»'})
                </Typography.Text>
                <Typography.Text tag="span" view="primary-medium" weight="bold" className={answerSt.calcValue}>
                  × {selectedCoeff.toFixed(2)}
                </Typography.Text>
              </div>

              <div className={answerSt.calcRow}>
                <Typography.Text tag="span" view="secondary-large" color="secondary">
                  Комиссия (2%)
                </Typography.Text>
                <Typography.Text tag="span" view="primary-medium" className={answerSt.calcValue}>
                  − {formatRub(commission)}
                </Typography.Text>
              </div>

              <div className={answerSt.calcRow}>
                <Typography.Text tag="span" view="secondary-large" color="secondary">
                  ⚠ Если ошибётесь
                </Typography.Text>
                <Typography.Text tag="span" view="primary-medium" className={answerSt.calcValue}>
                  − {formatRub(sum)}
                </Typography.Text>
              </div>
            </div>

            <div className={answerSt.calcDivider} />

            <div className={answerSt.resultRow}>
              <Typography.Text tag="span" view="secondary-large" color="secondary">
                Получите при выигрыше
              </Typography.Text>
              <Typography.TitleMobile
                tag="h2"
                view="medium"
                font="system"
                style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}
              >
                <b>{winAmount.toLocaleString('ru-RU')}</b>{' '}
                <Typography.TitleMobile
                  tag="div"
                  view="xsmall"
                  font="system"
                  color="secondary"
                  style={{ marginBottom: '2px' }}
                  weight="medium"
                >
                  ₽ кешбэка
                </Typography.TitleMobile>
              </Typography.TitleMobile>
            </div>
          </section>
        </div>
        <Gap size={48} />
      </section>
      <div className={answerSt.bottomBar}>
        <button type="button" className={answerSt.backButton} onClick={onBack}>
          <ChevronLeftMIcon className={answerSt.backIcon} />
        </button>
        <Button
          onClick={submit}
          type="button"
          block
          className={answerSt.actionButton}
          view="primary"
          hint={
            <Typography.Text tag="span" view="secondary-large" color="primary-inverted">
              {sum.toLocaleString('ru-RU')} ₽ кешбэка
            </Typography.Text>
          }
        >
          <Typography.Text tag="span" view="primary-medium" color="primary-inverted" weight="medium">
            Поставить
          </Typography.Text>
        </Button>
      </div>
    </div>
  );
};
