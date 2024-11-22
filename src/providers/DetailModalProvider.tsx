import { ReactNode, useEffect, useState, useCallback } from "react"
import { useLocation } from "react-router-dom"

import { INITIAL_DETAIL_STATE } from "../../constants/index"
import createSafeContext from "src/lib/createSafeContext"
import { useLazyGetAppendedVideosQuery } from "src/store/slices/discover"
import { MEDIA_TYPE } from "../../types/Common"
import { MovieDetail } from "../../types/Movie"

interface DetailType {
  id?: number
  mediaType?: MEDIA_TYPE
}
export interface DetailModalConsumerProps {
  detail: { mediaDetail?: MovieDetail } & DetailType
  setDetailType: (newDetailType: DetailType) => void
}

export const [useDetailModal, Provider] =
  createSafeContext<DetailModalConsumerProps>()

const DetailModalProvider = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const location = useLocation()
  const [detail, setDetail] = useState<
    { mediaDetail?: MovieDetail } & DetailType
  >(INITIAL_DETAIL_STATE)

  const [getAppendedVideos] = useLazyGetAppendedVideosQuery()

  const handleChangeDetail = useCallback(
    async (newDetailType: { mediaType?: MEDIA_TYPE; id?: number }) => {
      if (newDetailType.id && newDetailType.mediaType) {
        const response = await getAppendedVideos({
          mediaType: newDetailType.mediaType,
          id: newDetailType.id, // Assertion removed
        }).unwrap()
        setDetail({ ...newDetailType, mediaDetail: response })
      } else {
        setDetail(INITIAL_DETAIL_STATE)
      }
    },
    []
  )

  useEffect(() => {
    setDetail(INITIAL_DETAIL_STATE)
  }, [location.pathname, setDetail])

  return (
    <Provider
      value={{
        detail,
        setDetailType: (newDetailType) => {
          void handleChangeDetail(newDetailType)
        },
      }}
    >
      {children}
    </Provider>
  )
}

export default DetailModalProvider
