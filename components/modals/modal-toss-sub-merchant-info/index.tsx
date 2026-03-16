"use client";

import { RiCloseLine } from "react-icons/ri";
import { useModalOpen } from "@/hooks/use-modal-open";

export type ModalTossSubMerchantInfoProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalTossSubMerchantInfo({
  isOpen,
  onClose,
}: ModalTossSubMerchantInfoProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-md flex-col rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            서브몰 ID 발급 방법
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6 font-whisper text-neutral-700 text-sm leading-relaxed">
          <p>
            서브몰 ID는 토스페이먼츠를 통한 국내 결제(토스,
            카카오페이, 네이버페이, 카드) 정산 수령에
            필요합니다.
          </p>
          <ol className="list-inside list-decimal space-y-3">
            <li>
              <a
                href="https://developer.tosspayments.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-black underline underline-offset-2 hover:text-neutral-600"
              >
                토스페이먼츠 개발자센터
              </a>
              에 접속합니다.
            </li>
            <li>
              토스페이먼츠 가맹점 계정으로 로그인합니다.
            </li>
            <li>
              <strong>설정</strong> →{" "}
              <strong>서브몰 관리</strong> 메뉴로
              이동합니다.
            </li>
            <li>
              예금주명, 은행명, 계좌번호 등 계좌 정보를
              입력하여 서브몰을 등록합니다.
            </li>
            <li>
              승인 후 발급된 <strong>서브몰 ID</strong>를
              복사하여 결제 설정에 붙여넣습니다.
            </li>
          </ol>
          <p className="pt-2 text-neutral-500 text-xs">
            문의: 토스페이먼츠 고객센터{" "}
            <a
              href="tel:1544-7772"
              className="font-medium text-black underline underline-offset-2"
            >
              1544-7772
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
