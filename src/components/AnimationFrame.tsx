import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CircularProgress, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  name: string;
  playback: number;
};

function AnimationFrame(props: Props) {
  const { t } = useTranslation('AnimationFrame');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [visible, setVisible] = React.useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { name, playback } = props;
  var observer: IntersectionObserver;
  var animationRequest: number;

  useEffect(() => {
    observer = new IntersectionObserver(intersectionObserver);
    wrapperRef.current && observer.observe(wrapperRef.current);
  }, []);

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', function () {
        var virtualHeight = Math.floor(this.duration) * playback + 'px';
        if (wrapperRef.current != null) {
          wrapperRef.current.style.height = virtualHeight;
          animationRequest = requestAnimationFrame(scrollPlay);
          setLoading(false);
        }
      });
    } else {
      cancelAnimationFrame(animationRequest);
    }
  }, [visible]);

  const intersectionObserver = (
    entries: IntersectionObserverEntry[],
    io: IntersectionObserver,
  ) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        io.unobserve(entry.target);
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
  };

  function scrollPlay() {
    if (wrapperRef.current && videoRef.current) {
      const distanceFromTop =
        window.scrollY + wrapperRef.current.getBoundingClientRect().top;
      const rawScrollPercent =
        (window.scrollY - distanceFromTop) /
        (wrapperRef.current.scrollHeight - window.innerHeight);
      const scrollPercent = Math.min(Math.max(rawScrollPercent, 0), 1);
      videoRef.current.currentTime = videoRef.current.duration * scrollPercent;
      animationRequest = requestAnimationFrame(scrollPlay);
    }
  }

  return (
    <Wrapper ref={wrapperRef} className="annimation_wrapper">
      <Content>
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <CircularProgress size={60} sx={{ color: '#fff' }} />
          </Box>
        )}
        {visible && (
          <Video ref={videoRef} muted>
            <source type="video/mp4" src={'/anim/' + name + '.mp4'} />
            <source type="video/webm" src={'/anim/' + name + '.webm'} />
            <source type="video/ogg" src={'/anim/' + name + '.ogg'} />
            {t('video-format-warning')}
          </Video>
        )}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: block;
  min-height: '100vh';
`;

const Video = styled.video`
  object-fill: contain;
  max-width: 100%;
  height: 100vh;
  display: block;
  margin: auto;
  -webkit-clip-path: inset(3px 3px);
  clip-path: inset(3px 3px);
`;

const Content = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
  height: 100vh;
`;

export default AnimationFrame;
